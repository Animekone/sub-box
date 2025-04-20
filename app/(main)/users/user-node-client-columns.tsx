"use client";

import { Edit2, Trash2 } from "lucide-react";

import { CollapseDisplay } from "@/components/collapse-display";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DateTime } from "@/components/date-time";
import { IdBadge } from "@/components/id-badge";
import { Button } from "@/components/ui/button";
import { type Node as DbNode, type NodeClient, type User } from "@/types";
import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

interface CreateColumnsOptions {
  userId: string;
  nodes: DbNode[];
  users: User[];
  onEdit: (item: NodeClient & { users: { userId: string; enable: boolean; order: number; virtualOrder?: number }[] }) => void;
  onDelete: (item: NodeClient & { users: { userId: string; enable: boolean; order: number; virtualOrder?: number }[] }) => void;
}

export function createColumns({ userId, nodes, users, onEdit, onDelete }: CreateColumnsOptions): ColumnDef<NodeClient & { users: { userId: string; enable: boolean; order: number; virtualOrder?: number }[] }>[] {
  return [
    {
      id: "order",
      accessorFn: (row) => {
        const userOption = row.users.find(u => u.userId === userId);
        return userOption?.virtualOrder ?? 0;
      },
      header: ({ column }) => <DataTableColumnHeader column={column} title="顺序" />,
      cell: ({ row }) => {
        const userOption = row.original.users.find(u => u.userId === userId);
        return userOption?.virtualOrder ?? 0;
      },
      meta: {
        title: "顺序",
      },
      sortingFn: (rowA, rowB) => {
        const orderA = rowA.original.users.find(u => u.userId === userId)?.order ?? 0;
        const orderB = rowB.original.users.find(u => u.userId === userId)?.order ?? 0;
        return orderA - orderB;
      },
    },
    {
      accessorKey: "id",
      header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
      cell: ({ row }) => <IdBadge id={row.getValue("id")} />,
      meta: {
        title: "ID",
      },
    },
    {
      accessorKey: "nodeId",
      header: ({ column }) => <DataTableColumnHeader column={column} title="节点" />,
      cell: ({ row }) => {
        const node = nodes.find((n) => n.id === row.getValue("nodeId"));
        return node?.name || "-";
      },
      meta: {
        title: "节点",
      },
    },
    {
      id: "usersList",
      accessorFn: (row) => row.users,
      header: ({ column }) => <DataTableColumnHeader column={column} title="用户" />,
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.users.map((userOption) => {
            const user = users.find((u) => u.id === userOption.userId);
            if (!user) return null;
            return (
              <Badge key={user.id} variant={userOption.enable ? "default" : "outline"}>
                {user.name}
                {!userOption.enable && <span className="ml-1">(已禁用)</span>}
              </Badge>
            );
          })}
        </div>
      ),
      meta: {
        title: "用户",
      },
    },
    {
      accessorKey: "url",
      header: ({ column }) => <DataTableColumnHeader column={column} title="URL" />,
      cell: ({ row }) => <CollapseDisplay url={row.getValue("url")} />,
      meta: {
        title: "URL",
      },
    },
    {
      id: "status",
      accessorFn: (row) => {
        const userOption = row.users.find(u => u.userId === userId);
        return userOption?.enable;
      },
      header: ({ column }) => <DataTableColumnHeader column={column} title="状态" />,
      cell: ({ row }) => {
        const userOption = row.original.users.find(u => u.userId === userId);
        return userOption?.enable ? "启用" : "禁用";
      },
      meta: {
        title: "状态",
      },
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="更新时间" />,
      cell: ({ row }) => <DateTime date={row.getValue("updatedAt")} />,
      meta: {
        title: "更新时间",
      },
    },
    {
      id: "actions",
      header: ({ column }) => <DataTableColumnHeader column={column} title="操作" />,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
              <Edit2 className="h-4 w-4" />
              <span className="sr-only">编辑</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(item)}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">删除</span>
            </Button>
          </div>
        );
      },
      meta: {
        title: "操作",
      },
      enableHiding: false,
    },
  ];
} 