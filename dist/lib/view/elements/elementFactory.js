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
import { logger } from '../../logger';
let customFactory;
export const elementFactory = {
    /**
     * Sets a custom factory to create app-specific view components
     * @param factory custom factory
     */
    setCustomFactory(factory) {
        if (customFactory) {
            logger.warn('Overriding existing custom factory for view components.');
        }
        else {
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
    newElement(pc, fc, comp, maxWidth, value) {
        if (customFactory) {
            const view = customFactory.newViewComponent(pc, fc, comp, maxWidth, value);
            if (view) {
                console.info(`Component '${comp.name}' created at the app-specific factory.`);
                return view;
            }
        }
        let field;
        switch (comp.compType) {
            case 'button':
            case 'static':
                return new LeafElement(pc, fc, comp, maxWidth);
            case 'field':
                field = comp;
                if (field.renderAs === 'hidden') {
                    return new HiddenField(pc, fc, field, maxWidth, value);
                }
                return new FieldElement(pc, fc, field, maxWidth, value);
            case 'panel':
                return new PanelElement(pc, fc, comp, maxWidth);
            case 'buttonPanel':
                return new ButtonPanelElement(pc, fc, comp, maxWidth);
            case 'tabs':
                return new TabsElement(pc, fc, comp, maxWidth);
            case 'table':
            case 'chart':
                if (!fc) {
                    throw new Error(`A table element named ${comp.name} is embedded inside another table. This feature is not supported`);
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
                    return new ChartElement(pc, fc, comp, maxWidth);
                }
                if (comp.editable) {
                    return new TableEditorElement(pc, fc, comp, maxWidth);
                }
                return new TableViewerElement(pc, fc, comp, maxWidth);
            case 'range':
                return new RangeElement(pc, fc, comp, maxWidth);
            default:
                throw new Error(`Component ${comp.name} has an invalid compType of  ${comp.compType}`);
        }
    },
};
//# sourceMappingURL=elementFactory.js.map