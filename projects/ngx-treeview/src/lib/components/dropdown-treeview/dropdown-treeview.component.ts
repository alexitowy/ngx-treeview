import { Component, EventEmitter, Input, Output, ViewChild, TemplateRef } from '@angular/core';
import { TreeviewI18n } from '../../models/treeview-i18n';
import { TreeviewItem } from '../../models/treeview-item';
import { TreeviewConfig } from '../../models/treeview-config';
import { TreeviewComponent } from '../treeview/treeview.component';
import { TreeviewHeaderTemplateContext } from '../../models/treeview-header-template-context';
import { TreeviewItemTemplateContext } from '../../models/treeview-item-template-context';

@Component({
  selector: 'ngx-dropdown-treeview',
  templateUrl: './dropdown-treeview.component.html',
  styleUrls: ['./dropdown-treeview.component.scss']
})
export class DropdownTreeviewComponent {
  @Input() buttonClass = 'btn-outline-secondary';
  @Input() headerTemplate: TemplateRef<TreeviewHeaderTemplateContext>;
  @Input() itemTemplate: TemplateRef<TreeviewItemTemplateContext>;
  @Input() items: TreeviewItem[];
  @Input() config: TreeviewConfig;
  @Input() defaultSelect: any[];
  @Output() selectedChange = new EventEmitter<any[]>(true);
  @Output() filterChange = new EventEmitter<string>();
  @ViewChild(TreeviewComponent, { static: false }) treeviewComponent: TreeviewComponent;
  buttonLabel: string;

  constructor(
    public i18n: TreeviewI18n
  ) {
    this.config = TreeviewConfig.create(this.config);
  }

  ngOnInit(): void{
    if (this.defaultSelect && this.defaultSelect.length > 0) {
      this.getDefault(this.defaultSelect[0])
    }
  }

  async getDefault(id: string){
    const result = await this.config.urlCallbackById(id);
    this.buttonLabel = result.valor;
  }

  onSelectedChange(values: any[]): void {
    this.buttonLabel = this.i18n.getText(this.treeviewComponent.selection);
    this.selectedChange.emit(values);
  }

  onFilterChange(text: string): void {
    this.filterChange.emit(text);
  }
}
