/**
 * This file is the barrel for all design related types
 *
 * NOTE: all the files in this folder can import from @/common and from each other. No other imports are allowed.
 * This is to ensure that our design flows are not broken by inadvertent imports.
 */
export type * from './appDesign';
export type * from './form';
export type * from './layout';
export type * from './list';
export type * from './page';
export type * from './pageAlteration';
export type * from './record';
export type * from './service';
export type * from './sql';
export type * from './template';
export type * from './valueSchema';
