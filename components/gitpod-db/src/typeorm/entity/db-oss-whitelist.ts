/**
 * Copyright (c) 2021 Gitpod GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License-AGPL.txt in the project root for license information.
 */

import { Column, Entity, PrimaryColumn } from "typeorm";
import { OssWhitelist } from "@gitpod/gitpod-protocol";

@Entity()
// on DB but not Typeorm: @Index("ind_lastModified", ["_lastModified"])   // DBSync
export class DBOssWhitelist implements OssWhitelist {
    @PrimaryColumn({
        /**
         * Fixed length for improved indexing. The concreate limitation is arbitrary,
         * but guaranteed to be longer then GitHub's profile names (64 chars) + host
         */
        length: 128,
    })
    identity: string;

    @Column()
    deleted?: boolean;
}