import { Component, Input } from '@angular/core';
@Component({
    selector: 'd-header',
    templateUrl: './d.header.html',
})

export class AppHeaderComponent {
    @Input() title: string;
}