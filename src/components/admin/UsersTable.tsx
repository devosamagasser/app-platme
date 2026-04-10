import { useState } from "react";
import { Search, Shield, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminProfile } from "@/services/adminService";

interface UsersTableProps {
  profiles: AdminProfile[];
}

const UsersTable = ({ profiles }: UsersTableProps) => {
  const [search, setSearch] = useState("");

  const filtered = profiles.filter(
    (p) =>
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      (p.full_name && p.full_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold flex-1">Users</h2>
        <div className="relative w-64">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ps-9 bg-card border-primary/10"
          />
        </div>
      </div>

      <div className="border border-primary/10 rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-card hover:bg-card">
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-center">Tokens</TableHead>
              <TableHead className="text-center">Developer</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((user) => (
                <TableRow key={user.id} className="hover:bg-primary/5">
                  <TableCell className="font-mono text-xs">{user.email}</TableCell>
                  <TableCell>{user.full_name || "—"}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={user.tokens < 10 ? "destructive" : "secondary"}>
                      {user.tokens}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {user.is_developer ? (
                      <ShieldCheck className="h-4 w-4 text-primary mx-auto" />
                    ) : (
                      <Shield className="h-4 w-4 text-muted-foreground/30 mx-auto" />
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UsersTable;
