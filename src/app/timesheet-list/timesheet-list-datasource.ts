import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

import * as moment from 'moment';

// TODO: Replace this with your own data model type
export interface TimesheetListItem {
  weekNumber: number;
  startDate: string;
  endDate: string;
}

/**
 * Data source for the TimesheetList view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class TimesheetListDataSource extends DataSource<TimesheetListItem> {
  data: TimesheetListItem[] = this.createData();
  paginator: MatPaginator;
  sort: MatSort;

  constructor() {
    super();
  }

  private createData(): TimesheetListItem[] {
    let data:TimesheetListItem[] = [];
    let weeks: number = moment().weeksInYear();
    var weekStart = moment().startOf('year').startOf('week');
    for (var i = 0; i < weeks; ++i) {
      data.push(
        {
          weekNumber: i + 1,
          startDate: weekStart.format('DD-MM-YYYY'),
          endDate: weekStart.endOf('week').format('DD-MM-YYYY')
        }
      );

      weekStart.startOf('week');
      weekStart.add(1, 'weeks')
    }

    return data;
  }
  

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<TimesheetListItem[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      observableOf(this.data),
      this.paginator.page,
      this.sort.sortChange
    ];

    return merge(...dataMutations).pipe(map(() => {
      return this.getPagedData(this.getSortedData([...this.data]));
    }));
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: TimesheetListItem[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: TimesheetListItem[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'weekNumber': return compare(a.weekNumber, b.weekNumber, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
