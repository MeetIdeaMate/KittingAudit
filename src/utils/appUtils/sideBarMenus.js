export const KbMenus = () => [
    { MenuName: 'Dashboard', subMenu: [] },
    { MenuName: 'SOBUpload', subMenu: [] },
    { MenuName: 'CSLUpload', subMenu: [] },
    { MenuName: 'KanbanUpload', subMenu: [] },
    // { MenuName: 'Kitting', subMenu: [] },
    { MenuName: 'Download', subMenu: [] },
    { MenuName: 'Audit', subMenu: [] },
    { MenuName: 'Reports', subMenu: [] },
    { MenuName: 'User', subMenu: [] },
    {
        MenuName: 'Master', subMenu: [
            { menuName: 'Product' },
            { menuName: 'Customer' },
            { menuName: "Supplier" },
            { menuName: 'Transporters' },
            { menuName: 'SpecificationMaster' },
            { menuName: 'ConfigMaster' },
            { menuName: 'Employee' },
            { menuName: 'Questionnaire' },
            { menuName: 'JobWorker' },
        ]
    },
];