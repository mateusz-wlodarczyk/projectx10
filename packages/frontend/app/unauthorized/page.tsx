"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center">
            <div className="p-3 bg-destructive/10 rounded-full">
              <Shield className="h-6 w-6 text-destructive" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have permission to access this resource
          </p>
        </div>

        {/* Error Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-destructive" />
              <span>Unauthorized Access</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-4">
              <div className="text-destructive text-sm">
                Error 403: Forbidden
              </div>
              <p className="text-sm text-muted-foreground">
                You don't have the required permissions to view this page.
                Please contact your administrator if you believe this is an
                error.
              </p>

              <div className="flex flex-col space-y-2">
                <Link href="/dashboard">
                  <Button className="w-full">Go to Dashboard</Button>
                </Link>

                <Link href="/">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
