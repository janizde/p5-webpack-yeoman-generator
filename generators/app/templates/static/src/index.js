<% if (props.mode === 'global') { %>import 'p5';<% } else { %>import p5 from 'p5';<% } %>
<% if (props.libraries.indexOf('sound') > -1) { %>import 'p5/lib/addons/p5.sound';<% } %>
<% if (props.libraries.indexOf('dom') > -1) { %>import 'p5/lib/addons/p5.dom';<% } %>
<% if (props.mode === 'global') { %>
import * as sketchHooks from './sketch';

// Attach everything that is exported from sketch to window
(w => Object.keys(sketchHooks).forEach(hook => { w[hook] = sketch[hook]; }))(window);
<% } else { %>
import sketch from './sketch';

new p5(sketch);
<% } %>