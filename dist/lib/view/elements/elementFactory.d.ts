import { FormController, PageComponent, PageController, Value, ViewComponentFactory } from '@/types';
import { BaseElement } from './baseElement';
export declare const elementFactory: {
    /**
     * Sets a custom factory to create app-specific view components
     * @param factory custom factory
     */
    setCustomFactory(factory: ViewComponentFactory): void;
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
    newElement(pc: PageController, fc: FormController | undefined, comp: PageComponent, maxWidth: number, value?: Value): BaseElement;
};
