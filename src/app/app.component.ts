import {Component, OnInit, ViewChild} from '@angular/core';
import {TablePaginatorComponent} from './table-paginator/table-paginator.component';
import {CasesService} from './service/cases.service';
import {CaseData} from './interface/case-data';

declare var faker: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [CasesService],
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  pushingData: boolean;
  @ViewChild(TablePaginatorComponent) table: TablePaginatorComponent;

  constructor(private casesService: CasesService) {
  }

  ngOnInit(): void {
    this.pushingData = false;
  }

  togglePushData(): void {
    this.pushingData = !this.pushingData;
    if (this.pushingData) {
      this.pushData(1000);
    }
  }

  // todo add second configurator
  private async pushData(ms: number): Promise<void> {
    while (this.pushingData) {

      const fakeDate = faker.date.recent().toLocaleString();
      const fakeName = faker.name.firstName() + ' ' + faker.name.lastName();
      const fakeAge = faker.datatype.number({max: 100});
      const fakeGender = faker.name.gender(2);
      const fakeCity = faker.address.city();

      const fakeData: CaseData = {
        date: fakeDate,
        name: fakeName,
        age: fakeAge,
        gender: fakeGender,
        city: fakeCity
      };

      this.casesService.addCase(fakeData).subscribe(caseData => {
          console.log(caseData);
          const dataTable = this.table.dataSource.data;
          dataTable.push(caseData);
          this.table.dataSource.data = dataTable;
        }
      );
      await this.sleep(ms);
    }
  }

  private async sleep(ms: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
