import { useState } from "react";
import { Search, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { updatePlatformStatus, type AdminPlatform, type AdminProfile } from "@/services/adminService";

interface PlatformsTableProps {
  platforms: AdminPlatform[];
  profiles: AdminProfile[];
}

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  suspended: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  pending: "bg-blue-500/15 text-blue-400 border-blue-500/30",
};

const PlatformsTable = ({ platforms, profiles }: PlatformsTableProps) => {
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const profileMap = new Map(profiles.map((p) => [p.id, p]));

  const filtered = platforms.filter((p) =>
    p.subdomain.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatusChange = async (platformId: string, newStatus: string) => {
    const { error } = await updatePlatformStatus(platformId, newStatus);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Updated", description: `Platform status changed to ${newStatus}` });
      queryClient.invalidateQueries({ queryKey: ["admin", "platforms"] });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold flex-1">Platforms</h2>
        <div className="relative w-64">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search platforms..."
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
              <TableHead>Subdomain</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead className="text-center">Price/mo</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Storage</TableHead>
              <TableHead className="text-center">Capacity</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  No platforms found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((platform) => {
                const owner = profileMap.get(platform.user_id);
                return (
                  <TableRow key={platform.id} className="hover:bg-primary/5">
                    <TableCell className="font-mono text-xs font-medium">{platform.subdomain}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{owner?.email || "—"}</TableCell>
                    <TableCell className="text-center font-mono text-xs">${platform.monthly_price}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={statusColors[platform.status] || ""}>
                        {platform.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-xs">{platform.storage_gb}GB</TableCell>
                    <TableCell className="text-center text-xs">{platform.capacity_users}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(platform.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {platform.status !== "active" && (
                            <DropdownMenuItem onClick={() => handleStatusChange(platform.id, "active")}>
                              ✅ Activate
                            </DropdownMenuItem>
                          )}
                          {platform.status !== "suspended" && (
                            <DropdownMenuItem onClick={() => handleStatusChange(platform.id, "suspended")}>
                              ⚠️ Suspend
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PlatformsTable;
