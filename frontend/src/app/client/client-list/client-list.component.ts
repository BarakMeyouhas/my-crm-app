import { Component, OnInit } from "@angular/core";
import { ClientService } from "../../services/client.service";

@Component({
  selector: "app-client-list",
  templateUrl: "./client-list.component.html",
  styleUrls: ["./client-list.component.css"],
})
export class ClientListComponent implements OnInit {
  clients: any[] = [];

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.clientService.getClients().subscribe((res: any) => {
      this.clients = res;
    });
  }

  addClient() {
    // פעולה לביצוע – למשל, ניווט לעמוד הוספת לקוח או פתיחת מודאל
    console.log('Add client clicked');
  }
}
