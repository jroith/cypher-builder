/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { Expr } from "..";
import { HasLabel } from "../expressions/HasLabel";
import { LabelExpr } from "../expressions/labels/label-expressions";
import type { NamedReference } from "./Variable";
import { Variable } from "./Variable";

export type NodeProperties = Record<string, Expr>;

type NodeRefOptions = {
    labels?: Set<string> | Array<string> | LabelExpr;
};

/** Represents a node reference
 * @group Variables
 */
export class NodeRef extends Variable {
    public labels: string[] | LabelExpr;

    constructor(options: NodeRefOptions = {}) {
        super();
        this.prefix = "this";
        this.labels = this.parseLabels(options.labels);
    }

    public hasLabels(...labels: string[]): HasLabel {
        return new HasLabel(this, labels);
    }

    public hasLabel(label: string): HasLabel {
        return new HasLabel(this, [label]);
    }

    private parseLabels(labelsOption: NodeRefOptions["labels"]): string[] | LabelExpr {
        if (labelsOption instanceof LabelExpr) return labelsOption;
        return Array.from(labelsOption ?? []);
    }
}

/** Represents a node reference with a given name
 * @group Variables
 */
export class NamedNode extends NodeRef implements NamedReference {
    public readonly id: string;

    constructor(id: string, options?: NodeRefOptions) {
        super(options ?? {});
        this.id = id;
    }

    public get name(): string {
        return this.id;
    }
}
