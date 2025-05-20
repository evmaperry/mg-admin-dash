import React, { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

const MapMarkerTable: React.FC<{}> = ({}) => {
  const [selectedTab, setSelectedTab] = useState<string>('pins');

  const PinsTable: React.FC<{}> = ({}) => {
    return (
      <>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Category & Type</TableHead>
            <TableHead>Edit</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
      </>
    );
  };

  return (
    <div className={'w-full border'}>
      <ToggleGroup
        value={selectedTab}
        onValueChange={setSelectedTab}
        variant={'outline'}
        type='single'
      >
        <ToggleGroupItem value='pins'>Pins</ToggleGroupItem>
        <ToggleGroupItem value='plans'>Plans</ToggleGroupItem>
        <ToggleGroupItem value='routes'>Routes</ToggleGroupItem>
        <ToggleGroupItem value='areas'>Areas</ToggleGroupItem>
        <ToggleGroupItem value='structures'>Structures</ToggleGroupItem>
      </ToggleGroup>
      <Table>
        <TableCaption>Edit and delete your app's {selectedTab}</TableCaption>
        {selectedTab === 'pins' && <PinsTable />}
      </Table>
    </div>
  );
};

export default MapMarkerTable;
