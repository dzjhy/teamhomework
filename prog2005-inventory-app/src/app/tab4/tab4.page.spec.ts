import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page {
  constructor(private alertController: AlertController) {}

  // 显示帮助
  async showHelp() {
    const alert = await this.alertController.create({
      header: '关于此页面',
      message: '此页面展示本应用的隐私政策与安全措施说明。',
      buttons: ['知道了']
    });
    await alert.present();
  }
}