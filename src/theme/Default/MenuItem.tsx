import React from 'react';
import { Link } from 'react-router-dom';
import {
  colors,
} from '@material-ui/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Hidden,
} from '@material-ui/core';

import { LayoutContext } from './LayoutProvider';
import { PaletteType } from '@nvdunginest/emis-mui';

type MenuItemProps = {
  link: string;
  icon: IconProp;
  color: PaletteType;
  text: string;
}

type PaletteColorType = {
  color: PaletteType;
  value: string;
}

const palette: PaletteColorType[] = [
  { color: 'danger', value: '#DC3545' },
  { color: 'dark', value: '#212529' },
  { color: 'info', value: '#0DCAF0' },
  { color: 'inherit', value: 'inherit' },
  { color: 'primary', value: '#0D6EFD' },
  { color: 'secondary', value: '#6C757D' },
  { color: 'success', value: '#198754' },
  { color: 'warning', value: '#FFC107' },
];

const getColorValue = (color: PaletteType): string => {
  const colorPalette = palette.find(x => x.color === color);
  if (colorPalette !== undefined) {
    return colorPalette.value;
  }

  return colors.blue[900];
}

export default function MenuItem({
  link,
  icon,
  color,
  text,
}: MenuItemProps): JSX.Element {
  const { mobileOpen, drawerOpen, onMobileToggle } = React.useContext(LayoutContext);

  const handleClickMenu = () => {
    if (mobileOpen) {
      onMobileToggle();
    }
  };

  return (
    <>
      {/* Lg */}
      <Hidden mdDown implementation="css">
        <ListItem button component={Link} to={link}>
          <ListItemIcon>
            <FontAwesomeIcon icon={icon} color={getColorValue(color)} style={{ fontSize: '1.25rem' }} />
          </ListItemIcon>
          <ListItemText secondary={text} />
        </ListItem>
      </Hidden>
      {/* Lg */}

      {/* Sm --> Md */}
      <Hidden lgUp xsDown implementation="css">
        <ListItem button component={Link} to={link}>
          <ListItemIcon>
            <FontAwesomeIcon icon={icon} color={getColorValue(color)} style={{ fontSize: '1.25rem' }} />
          </ListItemIcon>
          <ListItemText secondary={drawerOpen ? text : ''} />
        </ListItem>
      </Hidden>
      {/* Sm --> Md */}

      {/* Xs */}
      <Hidden smUp implementation="css">
        <ListItem button component={Link} to={link} onClick={handleClickMenu}>
          <ListItemIcon>
            <FontAwesomeIcon icon={icon} color={getColorValue(color)} style={{ fontSize: '1.25rem' }} />
          </ListItemIcon>
          <ListItemText secondary={text} />
        </ListItem>
      </Hidden>
      {/* Xs */}
    </>
  );
}
