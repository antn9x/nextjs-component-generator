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

export const componentTemplate = (name = '') => `import React, { useState } from 'react';

function ${name}() {

  return (
    <div className='${name}'>

    </div>
  );
}

export default ${name};
`;