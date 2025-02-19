import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';

interface ConversationGroup {
  date: string;
  conversations: Array<{
    title: string;
    messageCount: number;
    firstMessage: string;
    id?: string;
  }>;
}

interface ConversationsGroupedTableProps {
  conversationGroups: ConversationGroup[];
}

const ConversationsGroupedTable: React.FC<ConversationsGroupedTableProps> = ({
  conversationGroups,
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;
  
  const paginatedGroups = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    let count = 0;
    let result = [];
    
    for (const group of conversationGroups) {
      if (count >= endIndex) break;
      
      if (count + group.conversations.length <= startIndex) {
        count += group.conversations.length;
        continue;
      }
      
      const startSlice = Math.max(0, startIndex - count);
      const endSlice = Math.min(
        group.conversations.length,
        endIndex - count
      );
      
      result.push({
        ...group,
        conversations: group.conversations.slice(startSlice, endSlice),
      });
      
      count += group.conversations.length;
    }
    
    return result;
  }, [conversationGroups, currentPage]);

  const totalItems = React.useMemo(() => 
    conversationGroups.reduce((sum, group) => sum + group.conversations.length, 0),
    [conversationGroups]
  );

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Date</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="w-[100px] text-right">Messages</TableHead>
              <TableHead className="max-w-[300px]">First Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedGroups.map((group) => (
              <React.Fragment key={group.date}>
                {group.conversations.map((conv, idx) => (
                  <TableRow key={`${group.date}-${idx}`}>
                    {idx === 0 && (
                      <TableCell
                        className="font-medium"
                        rowSpan={group.conversations.length}
                      >
                        {new Date(group.date).toLocaleDateString()}
                      </TableCell>
                    )}
                    <TableCell>
                      {conv.id ? (
                        <a 
                          href={`https://chat.openai.com/c/${conv.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {conv.title}
                        </a>
                      ) : (
                        conv.title
                      )}
                    </TableCell>
                    <TableCell className="text-right">{conv.messageCount}</TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      {conv.firstMessage}
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-end space-x-2 py-4 px-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversationsGroupedTable; 