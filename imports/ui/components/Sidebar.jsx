
import React from 'react';
import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from "flowbite-react";
import { FiHome, FiUsers } from "react-icons/fi";
import { MdOutlineFeedback } from "react-icons/md";
import { LuFileMusic } from "react-icons/lu";
import { Link } from 'react-router-dom';

const SidebarComponent = () => {
  return (
    <Sidebar className="mt-1" aria-label="Default sidebar example">
      <SidebarItems>
        <SidebarItemGroup>
          <SidebarItem as={Link} to="/" icon={FiHome}>
            Home
          </SidebarItem>
          <SidebarItem as={Link} to="/match" icon={FiUsers}>
            Collab Finder
          </SidebarItem>
          <SidebarItem as={Link} to="/feedback" icon={MdOutlineFeedback}>
            Feedback
          </SidebarItem>
          <SidebarItem as={Link} to="/sound/add" icon={LuFileMusic}>
            Sound Upload
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
};

export default SidebarComponent;
