import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { isNil } from 'lodash';
import { TreeviewConfig } from '../../models/treeview-config';
import { TreeviewItem } from '../../models/treeview-item';
import { TreeviewItemTemplateContext } from '../../models/treeview-item-template-context';

@Component({
  selector: 'ngx-treeview-item',
  templateUrl: './treeview-item.component.html',
  styleUrls: ['./treeview-item.component.scss']
})
export class TreeviewItemComponent {
  @Input() config: TreeviewConfig;
  @Input() template: TemplateRef<TreeviewItemTemplateContext>;
  @Input() item: TreeviewItem;
  @Input() defaultSelected: any[];
  @Output() checkedChange = new EventEmitter<boolean>();

  constructor(
    private defaultConfig: TreeviewConfig
  ) {
    this.config = this.defaultConfig;
  }

  ngOnInit(): void {
  }

  onCollapseExpand = async () => {
    /* if(this.item.lazy){
      if(!this.item.children){
        const result = await this.config.urlCallbackByIdParent(this.item.value);
        this.item.children = this.mapData(result);
        this.checkedBefore(this.item.children)
      }
    } */
    if (this.item.children.length > 0) {
      this.item.children = this.showSubChildrens(this.item.children);
    }
    this.item.collapsed = !this.item.collapsed;
  }

  checkedBefore(childrens: any[]) {
    for (let child of childrens) {
      if (this.defaultSelected.includes(child.value)) {
        child.checked = true;
      }
    }
  }

  showSubChildrens(data: any) {
    const currentItem = [];
    data?.forEach((item: any) => {
      const currentData: TreeviewItem = new TreeviewItem(item);
      const currentSubChild = [];
      if (item.children?.length > 0) {
        item.children.forEach((subChild: any) => {
          const childrenData: TreeviewItem = new TreeviewItem(subChild);
          if (subChild.hidden) {
            childrenData.hidden = false;
          }
          currentSubChild.push(childrenData)
        })
        currentData.children = currentSubChild;
      }
      currentItem.push(currentData);
    });

    return currentItem;
  }

  mapData(data: any) {
    let currentItem = [];
    /* data?.forEach((item: any) => {
      const splitLoc = (item.valor).split(">");
      const lastValor = splitLoc[splitLoc.length-1];
      item.lastValue = lastValor;
      item.nameLong = item.valor;
      const currentData: TreeviewItem = new TreeviewItem({
        text: item.lastValue,
        value: item.id,
        nameLong: item.nameLong,
      });
      currentData.collapsed = currentData?.children?.length > 0
      currentData.checked = false;
      if (item.hasOwnProperty('isDisabled')) {
        currentData.disabled = item.isDisabled;
        // if(item?.isDisabled && currentData?.children?.length > 0){
        //   currentData.children.forEach((child)=>{
        //     child.disabled = (this.dataAux?.find(el => el.id === child.value)).isDisabled;
        //   });
        // }
      } else {
        currentData.disabled = false;
      }
      currentItem.push(currentData);
    }); */
    return currentItem;
  }

  onCheckedChange = () => {
    const checked = this.item.checked;
    if (!isNil(this.item.children) && !this.config.decoupleChildFromParent) {
      this.item.children.forEach(child => child.setCheckedRecursive(checked));
    }
    this.checkedChange.emit(checked);
  }

  onChildCheckedChange(child: TreeviewItem, checked: boolean): void {
    if (!this.config.decoupleChildFromParent) {
      let itemChecked: boolean = null;
      for (const childItem of this.item.children) {
        if (itemChecked === null) {
          itemChecked = childItem.checked;
        } else if (itemChecked !== childItem.checked) {
          itemChecked = undefined;
          break;
        }
      }

      if (itemChecked === null) {
        itemChecked = false;
      }

      if (this.item.checked !== itemChecked) {
        this.item.checked = itemChecked;
      }

    }

    this.checkedChange.emit(checked);
  }
}
