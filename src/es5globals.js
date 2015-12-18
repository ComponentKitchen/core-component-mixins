/*
 * This file is processed to create an ES5-compatible distribution of
 * the core mixins and the standard base classes.
 */

// Core mixins
import AttributeMarshalling from './AttributeMarshalling';
import AutomaticNodeFinding from './AutomaticNodeFinding';
import TemplateStamping from './TemplateStamping';

window.AttributeMarshalling = AttributeMarshalling;
window.AutomaticNodeFinding = AutomaticNodeFinding;
window.TemplateStamping = TemplateStamping;

// Standard base classes
import ElementBase from './ElementBase';

window.ElementBase = ElementBase;
