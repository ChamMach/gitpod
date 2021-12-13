/**
 * Copyright (c) 2021 Gitpod GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License-AGPL.txt in the project root for license information.
 */

import { inject, injectable } from "inversify";
import { OssWhitelistDB } from "../oss-whitelist-db";
import { TypeORM } from './typeorm';
import { Repository } from "typeorm";
import { DBOssWhitelist } from "./entity/db-oss-whitelist";

@injectable()
export class OssWhitelistDBImpl implements OssWhitelistDB {

    @inject(TypeORM) typeORM: TypeORM;

    protected async getEntityManager() {
        return (await this.typeORM.getConnection()).manager;
    }

    protected async getRepo(): Promise<Repository<DBOssWhitelist>> {
        return (await this.getEntityManager()).getRepository<DBOssWhitelist>(DBOssWhitelist);
    }

    async delete(identity: string): Promise<void> {
        const repo = await this.getRepo();
        await repo.update(identity, { deleted: true });
    }

    async hasAny(identities: string[]): Promise<boolean> {
        const repo = await this.getRepo();
        const count = await repo.count({
            where: identities.map(identity => ({
                identity,
                deleted: false,
            })),
        });
        return count > 0;
    }
}