import {
  getSystemUserList,
  GetSystemUserListResponseItem,
} from '@/services/ProjectFile/ParticipatingUnitsDocuments';
import { Select, SelectProps } from 'antd';
import React, { useEffect, useState } from 'react';

interface TheSelectProps extends SelectProps {
  theEnumName?: string; //枚举名称;
}

const UserSelect: React.FC<TheSelectProps> = (props) => {
  let theProps = { ...props };
  delete theProps.theEnumName;

  const [theSelectList01, setTheSelectList01] = useState<GetSystemUserListResponseItem[]>([]);
  const getSelectList01 = async () => {
    let theList = await getSystemUserList();
    // console.log(`theList-->`, theList);

    setTheSelectList01(theList);
  };

  useEffect(() => {
    getSelectList01();
  }, []);

  return <Select options={theSelectList01} {...theProps} />;
};

export default UserSelect;
