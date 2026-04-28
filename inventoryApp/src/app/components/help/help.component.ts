import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './help.component.html',
  // 删掉了styleUrls引用，彻底解决找不到文件的报错
})
export class HelpComponent {
  @Input() pageTitle!: string;
  @Input() helpContent!: string;

  constructor(private modalController: ModalController) { }

  closeModal() {
    this.modalController.dismiss();
  }
}