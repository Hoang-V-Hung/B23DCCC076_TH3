import component from "@/locales/en-US/component";
import Icon from "@ant-design/icons";
import { icons } from "antd/lib/image/PreviewGroup";
import route from "mock/route";
import path from "path";

export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/appoint-mate',
		name: 'AppointMate',
		routes: [
			{
				path: 'lich-hen',
				name: 'Lịch hẹn',
				component: './AppointMate/Appointments/Appointments',
			},
			{
				path: 'nhan-vien',
				name: 'Nhân viên',
				component: './AppointMate/Employees/Employees',
			},
			{
				path:'dich-vu',
				name:'Dịch vụ',
				component:'./AppointMate/Services/Services',
			},
			{
				path:'danh-gia',
				name:'Đánh giá',
				component:'./AppointMate/Reviews/Reviews',
			},
			{
				path: 'thong-ke',
				name: 'Thống kê',
				component: './AppointMate/Reports/Reports',
			}
		],
		icon:'CarryOutOutlined'
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
