import { UsersInterface } from './../models/users.interface';
import { ResponseInterface } from './../models/response.interface';
import { BaseService } from './../services/base.service';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';
import { NgbdSortableHeader } from '../shared/sortable.directive';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  dataLoaded: boolean = false;

  constructor(private service: BaseService, private router: Router) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  users: UsersInterface[];
  page = 1;
  pageSize = 5;
  collectionSize = 0;
  fullUsersArray: UsersInterface[];

  getAllUsers() {
    this.dataLoaded = false;
    this.service.getAllData('users').subscribe((data: ResponseInterface) => {
      this.collectionSize = data.meta.pagination.total;
      this.dataLoaded = true;
      this.fullUsersArray = data.data;
      this.users = data.data
        .map((user, i) => ({ id: i + 1, ...user }))
        .slice(
          (this.page - 1) * this.pageSize,
          (this.page - 1) * this.pageSize + this.pageSize
        );
    });
  }
  search(e) {
    if (e.target.value != '') {
      this.users = this.fullUsersArray.filter((element) => {
        return element.name
          .toLowerCase()
          .includes(e.target.value.toLowerCase());
      });
    } else {
      this.getAllUsers();
    }
  }

  userClicked(id) {
    localStorage.setItem('userId', id);
    this.router.navigate(['/Posts']);
  }
}
