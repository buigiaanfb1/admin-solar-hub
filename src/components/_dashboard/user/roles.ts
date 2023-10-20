const roles = {
  Admin: [
    {
      code: '2',
      label: 'Owner'
    },
    {
      code: '3',
      label: 'Staff'
    },
    {
      code: '4',
      label: 'Customer'
    }
  ],
  Owner: [
    {
      code: '3',
      label: 'Staff'
    },
    {
      code: '4',
      label: 'Customer'
    }
  ],
  Staff: []
};

const genders = [
  {
    code: '1',
    label: 'Nam'
  },
  {
    code: '0',
    label: 'Nữ'
  }
];

const loginTypes = [
  {
    code: 'google',
    label: 'Google'
  },
  {
    code: 'manual',
    label: 'Thủ công'
  }
];

const roleMapping: any = {
  '1': 'Admin',
  '2': 'Owner',
  '3': 'Staff',
  '4': 'Customer'
};

export { roles, roleMapping, genders, loginTypes };
