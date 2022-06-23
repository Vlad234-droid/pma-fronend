import authContext from 'contexts/authContext';
import { getTescoBankContent } from 'features/bank/ShareWidget';
import React, { FC, useContext } from 'react';
import { Tenant } from 'utils';
import { getTescoContent } from './getTescoContent';
import { ShareWidgetBase, ShareWidgetBaseProps } from './ShareWidgetBase';

export const ShareWidget: FC<Omit<ShareWidgetBaseProps, 'getContent'>> = (props) => {
  const auth = useContext(authContext);
  const getContent = auth.tenant === Tenant.GENERAL ? getTescoContent : getTescoBankContent;

  return <ShareWidgetBase getContent={getContent} {...props} />;
};
