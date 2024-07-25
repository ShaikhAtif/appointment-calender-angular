import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddAppointmentDialogComponent } from './add-appointment-dialog/add-appointment-dialog.component';

interface Appointment {
  id: number;
  title: string;
  date: Date;
}

interface Day {
  date: Date | null;
  appointments: Appointment[];
}

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css']
})
export class CalenderComponent implements OnInit {
  currentMonth: Date = new Date();
  daysInMonth: Day[] = [];
  appointments: Appointment[] = [];
  nextAppointmentId: number = 1;

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.addAppointment({date: new Date(), title: 'ss', id: 1});
    this.generateCalendar();
  }

  generateCalendar(): void {
    const start = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    const end = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
    const startDayOfWeek = start.getDay();
    this.daysInMonth = [];

    // Fill in days before the start of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      this.daysInMonth.push({ date: null, appointments: [] });
    }

    // Fill in days of the month
    for (let day = 1; day <= end.getDate(); day++) {
      const date = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), day);
      const appointments = this.appointments.filter(appointment => new Date(appointment.date).toDateString() === date.toDateString());
      this.daysInMonth.push({ date, appointments });
    }

    this.currentMonth = new Date(this.currentMonth);
  }

  previousMonth(): void {
    this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
    this.generateCalendar();
  }

  openAddAppointmentDialog(date: Date = new Date()): void {
    const dialogRef = this.dialog.open(AddAppointmentDialogComponent, {
      width: '300px',
      data: { date: date, title: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addAppointment(result);
      }
    });
  }

  addAppointment(appointment: Appointment): void {
    appointment.id = this.nextAppointmentId++;
    this.appointments.push(appointment);
    this.generateCalendar();
  }

  deleteAppointment(day: Day, appointment: Appointment): void {
    const index = this.appointments.findIndex(a => a.id === appointment.id);
    if (index >= 0) {
      this.appointments.splice(index, 1);
      this.generateCalendar();
    }
  }
  dragAndDrop(event: CdkDragDrop<any>, day: Day): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(day.appointments, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      // Update the date in the global list
      const appointment = event.container.data[event.currentIndex];
      appointment.date = day.date!;
      const globalAppointment = this.appointments.find(a => a.id === appointment.id);
      if (globalAppointment) {
        globalAppointment.date = day.date!;
      }
    }
  }
}
