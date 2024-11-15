import { Tenant } from "@prisma/client";
import { LoaderFunctionArgs, redirect, ActionFunction, json } from "@remix-run/node";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import { RowAccess } from "~/application/enums/entities/RowAccess";
import { LinkedAccountStatus } from "~/application/enums/tenants/LinkedAccountStatus";
import { EntitiesApi } from "~/utils/api/.server/EntitiesApi";
import { RowPermissionsApi } from "~/utils/api/.server/RowPermissionsApi";
import { RowsApi } from "~/utils/api/.server/RowsApi";
import UrlUtils from "~/utils/app/UrlUtils";
import { getLinkedAccounts } from "~/utils/db/linkedAccounts.db.server";
import { adminGetAllTenants, getTenant } from "~/utils/db/tenants.db.server";
import { UserWithDetails, getUser, getUsersByTenant } from "~/utils/db/users.db.server";
import RowHelper from "~/utils/helpers/RowHelper";
import RowsRequestUtils from "../utils/RowsRequestUtils";
import EventsService from "~/modules/events/services/.server/EventsService";
import { RowSharedDto } from "~/modules/events/dtos/RowSharedDto";

export namespace Rows_Share {
  export type LoaderData = {
    meta: MetaTagsDto;
    rowData: RowsApi.GetRowData;
    routes: EntitiesApi.Routes;
    tenants: Tenant[];
    users: UserWithDetails[];
  };
  export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const { t, userId, tenantId, entity } = await RowsRequestUtils.getLoader({ request, params });
    if (!entity.isAutogenerated || entity.type === "system") {
      throw redirect(tenantId ? UrlUtils.currentTenantUrl(params, "404") : "/404");
    }
    const rowData = await RowsApi.get(params.id!, {
      entity,
      tenantId,
      userId,
    });
    if (rowData.item.createdByUserId !== userId) {
      const user = await getUser(userId);
      if (!user?.admin) {
        throw Error(t("shared.unauthorized"));
      }
    }
    let tenants: Tenant[] = [];
    if (tenantId) {
      tenants.push((await getTenant(tenantId))!);
      const linkedAccounts = await getLinkedAccounts(tenantId, LinkedAccountStatus.LINKED);
      linkedAccounts.forEach((linkedAccount) => {
        if (linkedAccount.clientTenantId === tenantId) {
          tenants.push(linkedAccount.providerTenant);
        } else {
          tenants.push(linkedAccount.clientTenant);
        }
      });
    } else {
      tenants = await adminGetAllTenants();
    }
    const data: LoaderData = {
      meta: [{ title: `${t("shared.share")} | ${RowHelper.getTextDescription({ entity, item: rowData.item, t })} | ${process.env.APP_NAME}` }],
      rowData,
      routes: EntitiesApi.getNoCodeRoutes({ request, params }),
      tenants,
      users: (await getUsersByTenant(tenantId)).filter((f) => f.id !== userId),
    };
    return json(data);
  };

  export const action: ActionFunction = async ({ request, params }) => {
    const { t, entity, tenantId, userId, form } = await RowsRequestUtils.getAction({ request, params });
    const user = await getUser(userId);
    if (!user) {
      throw redirect(tenantId ? UrlUtils.currentTenantUrl(params, "404") : "/404");
    }

    const action = form.get("action");
    if (!entity.isAutogenerated || entity.type === "system") {
      throw redirect(tenantId ? UrlUtils.currentTenantUrl(params, "404") : "/404");
    }
    const rowData = await RowsApi.get(params.id!, {
      entity,
      tenantId,
      userId,
    });

    if (action === "share") {
      const type = form.get("type")?.toString() as "tenant" | "user" | "role" | "group" | "public";
      const id = form.get("id")?.toString() ?? "";
      const access = form.get("access")?.toString() as RowAccess;
      try {
        await RowPermissionsApi.share(rowData.item, {
          type,
          id,
          access,
        });
        await EventsService.create({
          request,
          event: "row.shared",
          tenantId,
          userId,
          data: {
            id: rowData.item.id,
            title: RowHelper.getTextDescription({ entity, item: rowData.item, t }),
            entity: { id: entity.id, name: entity.name, slug: entity.slug, title: entity.title },
            type,
            to: id,
            access,
            user: { id: user.id, email: user.email },
          } satisfies RowSharedDto,
        });
        return json({ success: t("shared.saved") });
      } catch (error: any) {
        return json({ error: error.message }, { status: 400 });
      }
    } else if (action === "set-access") {
      const id = form.get("id")?.toString() ?? "";
      const access = form.get("access")?.toString() as RowAccess;
      await RowPermissionsApi.setAccess(id, access);
      return json({ success: t("shared.saved") });
    } else if (action === "remove") {
      const id = form.get("id")?.toString() ?? "";
      await RowPermissionsApi.del(id);
      return json({ success: t("shared.deleted") });
    } else {
      return json({ error: t("shared.invalidForm") }, { status: 400 });
    }
  };
}
