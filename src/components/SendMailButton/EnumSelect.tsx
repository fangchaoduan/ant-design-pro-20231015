import {
  getEnumBasicInfoList,
  GetEnumBasicInfoListResponseItem,
} from '@/services/ProjectFile/ParticipatingUnitsDocuments';
import { Select, SelectProps } from 'antd';
import React, { useEffect, useState } from 'react';

interface TheSelectProps extends SelectProps {
  theEnumName?: string; //枚举名称;
}

const EnumSelect: React.FC<TheSelectProps> = (props) => {
  let theProps = { ...props };
  delete theProps.theEnumName;

  const [theSelectList01, setTheSelectList01] = useState<GetEnumBasicInfoListResponseItem[]>([]);
  const getSelectList01 = async () => {
    if (!props?.theEnumName) {
      setTheSelectList01([]);
      return;
    }
    let theList = await getEnumBasicInfoList({ enumName: props?.theEnumName || `` });
    setTheSelectList01(theList);
  };

  useEffect(() => {
    getSelectList01();
  }, []);

  return <Select options={theSelectList01} {...theProps} />;
};

export default EnumSelect;
