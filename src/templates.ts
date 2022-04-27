import { NUMBER_NAMES_LIST } from "./constants";
import { isPlural } from 'pluralize';

export const pageTemplate = (name = ' ') => `
import React from 'react';
import ${name} from '../src/containers/${name}';

function ${name}Page() {
  return (
    <${name} />
  );
}

export default ${name}Page;
`;

function getTypeByName(name = '') {
  if (NUMBER_NAMES_LIST.includes(name)) {
    return 'number';
  }
  if (name.startsWith('on') || name.startsWith('set')) {
    return 'func';
  }
  if (name.startsWith('is')) {
    return 'bool';
  }
  if (isPlural(name)) {
    return 'array';
  }
  return 'string';
}

export const componentTemplate = (name = '', props = '') => `import React, { useState } from 'react';
${props ? `import PropTypes from 'prop-types';\n` : ''}
function ${name}(${props ? `{ ${props.split(',').join(', ')} }` : ''}) {

  return (
    <div className='${name}'>

    </div>
  );
}
${props
    ? `
${name}.propTypes = {
${props
      .split(',')
      .map((prop = '') =>
        prop.trim()
          ? `  ${prop.trim()}: PropTypes.${getTypeByName(prop)}${prop === 'className' ? '' : '.isRequired'
          },`
          : ''
      )
      .join('\n')}
};

${name}.defaultProps = {
};\n`
    : ''
  }
export default ${name};
`;