import React from 'react'
import { Outlet } from 'react-router';

function AdminLayout() {
    return (
        <>
        <Outlet />
        </>
    )
}

export default AdminLayout