import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';

interface TeamMember {
  initials: string;
  name: string;
  role: string;
}

const teamMembers: TeamMember[] = [
  { initials: "JW", name: "Joshua Watson", role: "Project Management" },
  { initials: "MA", name: "Muhammad Ahmed", role: "Business Analyst" },
  { initials: "RG", name: "Rishi Gajera", role: "Developer / Tester" },
  { initials: "MP", name: "Manthan Patel", role: "Developer / Tester" },
  { initials: "HS", name: "Hartono Susanto", role: "Developer" },
  { initials: "QN", name: "Quoc Nam Ngo", role: "Developer" },
];

const TeamSection = () => {
  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold mb-4 text-slate-800">Our Team</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <Card key={member.initials} className="p-6 flex flex-col items-center text-center bg-white/50 backdrop-blur-sm border border-slate-200">
            <Avatar className="h-16 w-16 mb-4 bg-blue-100">
              <AvatarFallback className="text-blue-600">
                {member.initials}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-slate-800 mb-1">{member.name}</h3>
            <div className="flex items-center text-slate-600 text-sm">
              <Briefcase className="w-4 h-4 mr-1" />
              {member.role}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default TeamSection;