import {
  Button,
  ButtonPanel,
  Chart,
  DataField,
  FormController,
  PageController,
  Panel,
  RangePanel,
  StaticComp,
  TableEditor,
  TableViewer,
  Tabs,
  Value,
  ViewComponentFactory,
  BaseComponent,
} from 'src/lib/types';

import { BaseElement } from './baseElement';
import { ButtonPanelElement } from './buttonPanel';
import { ChartElement } from './chartElement';
import { FieldElement } from './fieldElement';
import { HiddenField } from './hiddenField';
import { LeafElement } from './leafElement';
import { PanelElement } from './panelElement';
import { RangeElement } from './rangeElement';
import { TableEditorElement } from './tableEditorElement';
import { TableViewerElement } from './tableViewerElement';
import { TabsElement } from './tabsElement';
import { logger } from 'src/lib/logger';

let customFactory: ViewComponentFactory | undefined;
export const elementFactory = {
  /**
   * Sets a custom factory to create app-specific view components
   * @param factory custom factory
   */
  setCustomFactory(factory: ViewComponentFactory) {
    if (customFactory) {
      logger.warn('Overriding existing custom factory for view components.');
    } else {
      logger.info('Setting custom factory for view components.');
    }
    customFactory = factory;
  },

  /**
   * returns an instance of the right view component, or throws an error
   * @param pc
   * @param fc
   * @param comp
   * @param maxWidth max width units that the parent can accommodate. This is the actual width of the parent.
   * @param value used as the initial value if this is a field
   * @returns view-component instance
   * @throws Error in case the type of the supplied component is not recognized
   */
  newElement(
    pc: PageController,
    fc: FormController | undefined,
    comp: BaseComponent,
    maxWidth: number,
    value?: Value
  ): BaseElement {
    if (customFactory) {
      const view = customFactory.newViewComponent(
        pc,
        fc,
        comp,
        maxWidth,
        value
      ) as BaseElement;
      if (view) {
        console.info(
          `Component '${comp.name}' created at the app-specific factory.`
        );
        return view;
      }
    }

    switch (comp.compType) {
      case 'button':
      case 'static':
        return new LeafElement(pc, fc, comp as Button | StaticComp, maxWidth);

      case 'field':
        const field = comp as DataField;
        if (field.renderAs === 'hidden') {
          return new HiddenField(pc, fc, field, maxWidth, value);
        }
        return new FieldElement(pc, fc, field, maxWidth, value);

      case 'panel':
        return new PanelElement(pc, fc, comp as Panel, maxWidth);

      case 'buttonPanel':
        return new ButtonPanelElement(pc, fc, comp as ButtonPanel, maxWidth);

      case 'tabs':
        return new TabsElement(pc, fc, comp as Tabs, maxWidth);

      case 'table':
      case 'chart':
        if (!fc) {
          throw new Error(
            `A table element named ${comp.name} is embedded inside another table. This feature is not supported`
          );
        }
        /**
         * for a non-container, default is 4, but it should be 'full' for tables.
         * In a way, table is neither a leaf nor a container
         * TODO: This is the ONLY place where we are changing the attribute of component!!!
         */
        if (!comp.width) {
          comp.width = maxWidth;
        }
        if (comp.compType === 'chart') {
          return new ChartElement(pc, fc, comp as Chart, maxWidth);
        }
        if ((comp as TableEditor | TableViewer).editable) {
          return new TableEditorElement(pc, fc, comp as TableEditor, maxWidth);
        }
        return new TableViewerElement(pc, fc, comp as TableViewer, maxWidth);

      case 'range':
        return new RangeElement(pc, fc, comp as RangePanel, maxWidth);
      default:
        throw new Error(
          `Component ${comp.name} has an invalid compType of  ${comp.compType}`
        );
    }
  },
};
