import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminTransaction, AdminProfile } from "@/services/adminService";

interface TransactionsTableProps {
  transactions: AdminTransaction[];
  profiles: AdminProfile[];
}

const TransactionsTable = ({ transactions, profiles }: TransactionsTableProps) => {
  const profileMap = new Map(profiles.map((p) => [p.id, p]));
  const recent = transactions.slice(0, 50);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Recent Transactions</h2>

      <div className="border border-primary/10 rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-card hover:bg-card">
              <TableHead>User</TableHead>
              <TableHead className="text-center">Amount</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recent.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No transactions
                </TableCell>
              </TableRow>
            ) : (
              recent.map((tx) => {
                const owner = profileMap.get(tx.user_id);
                return (
                  <TableRow key={tx.id} className="hover:bg-primary/5">
                    <TableCell className="text-xs font-mono">{owner?.email || tx.user_id.slice(0, 8)}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={tx.amount > 0 ? "secondary" : "destructive"}>
                        {tx.amount > 0 ? "+" : ""}{tx.amount}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">{tx.reason}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(tx.created_at).toLocaleDateString()}
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

export default TransactionsTable;
