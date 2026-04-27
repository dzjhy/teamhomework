import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Tab1PageRoutingModule } from './tab1-routing.module';
import { Tab1Page } from './tab1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, // 必须导入，否则ngModel双向绑定会报错
    IonicModule,
    Tab1PageRoutingModule
  ],
  declarations: [Tab1Page], // 只有非standalone组件才能在这里声明
})
export class Tab1PageModule {}