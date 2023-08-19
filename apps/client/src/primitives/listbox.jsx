import React from 'react';
import { VariableSizeList, } from 'react-window';

import useSettings from '@/hooks/useSettings';
import { VARIABLES, } from '@pericles/constants';
import { getCountry, getIsoLang, getIsoLangFromString, } from '@pericles/util';

import AutocompleteOption from './autocompleteOption';

// Adapter for react-window
export default React.forwardRef((props, ref) => {
  const itemData = Array.from(props.children || []);
  const itemCount = itemData.length;
  const itemSize = 36;
  const { setSetting: onSettingChanged, } = useSettings();

  const voiceChanged = (event, value, key) => {
    console.log('voiceChanged-here', event, value, key);
    if (!value) return;
    onSettingChanged(VARIABLES.SETTINGS.VOICE, key);
  };

  function renderRow(props) {
    const { data, index, style, } = props;
    const dataSet = data[index];

    // console.log('renderRow', { dataSet });

    // if ('group' in dataSet) {
    //   return (
    //     <ListSubheader key={dataSet.key} component="div" style={style}>
    //       {dataSet.group}
    //     </ListSubheader>
    //   );
    // }

    const {
      props: { onClick, key, 'data-option-index': optionIndex, },
      option: { lang = '', countryCode = '', shortTitle = '', },
    } = dataSet;
    // console.log('renderRow', onClick);
    const iso = getIsoLang(getIsoLangFromString(lang));
    const dialect = getCountry(countryCode.toLocaleLowerCase());
    // console.log('renderOption', option, iso, dialect);
    // console.log('dataSet', dataSet);
    return (
      <AutocompleteOption
        style={{ ...style, }}
        key={key}
        shortTitle={shortTitle}
        optionIndex={optionIndex}
        onClick={(e) => {
          voiceChanged(e, shortTitle, optionIndex);
          console.log('got you here', e);
        }}
        dialect={dialect}
        iso={iso}
      />
    );
  }

  const getChildSize = (child) => {
    if ('group' in child) {
      return 48;
    }

    return itemSize;
  };

  // console.log('itemData', itemData);

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize;
    }
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
  };

  return (
    <VariableSizeList
      itemData={itemData}
      height={getHeight() + 2 * 8}
      width="100%"
      // ref={gridRef}
      // outerElementType={OuterElementType}
      // innerElementType="ul"
      itemSize={(index) => getChildSize(itemData[index])}
      overscanCount={5}
      itemCount={itemCount}
    >
      {renderRow}
    </VariableSizeList>
  );
});
