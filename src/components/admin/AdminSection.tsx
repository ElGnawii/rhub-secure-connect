import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users, Workflow } from "lucide-react";
import { UserManagement } from './UserManagement';
import { WorkflowManagement } from './WorkflowManagement';

export function AdminSection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Administration</h1>
        <p className="text-muted-foreground mt-1">
          Gérez les utilisateurs, rôles et workflows du système
        </p>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Gestion des utilisateurs</span>
          </TabsTrigger>
          <TabsTrigger value="workflows" className="flex items-center space-x-2">
            <Workflow className="w-4 h-4" />
            <span>Configuration des workflows</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="workflows">
          <WorkflowManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}