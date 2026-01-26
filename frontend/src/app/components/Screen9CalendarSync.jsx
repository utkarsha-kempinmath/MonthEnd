import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { Calendar, Plus, X, Check } from "lucide-react";

export function Screen9CalendarSync({ onContinue }) {
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [eventName, setEventName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [eventType, setEventType] = useState("exam");

  const [calendarEvents, setCalendarEvents] = useState([
    { id: 1, name: "Mid-term Exams", startDate: "2025-01-15", endDate: "2025-01-22", type: "exam" },
    { id: 2, name: "Project Submission", startDate: "2025-01-28", endDate: "2025-01-28", type: "submission" },
    { id: 3, name: "Annual Tech Fest", startDate: "2025-02-10", endDate: "2025-02-12", type: "fest" },
    { id: 4, name: "Final Exams", startDate: "2025-03-05", endDate: "2025-03-15", type: "exam" },
  ]);

  const eventTypeConfig = {
    exam: { label: "Exam Week", color: "bg-red-50 border-red-300 text-red-700", icon: "📝" },
    submission: { label: "Submission", color: "bg-orange-50 border-orange-300 text-orange-700", icon: "📤" },
    fest: { label: "College Fest", color: "bg-purple-50 border-purple-300 text-purple-700", icon: "🎉" },
    other: { label: "Other", color: "bg-gray-50 border-gray-300 text-gray-700", icon: "📅" },
  };

  const handleGoogleConnect = () => {
    setIsGoogleConnected(true);
    // Simulate adding events from Google Calendar
    setTimeout(() => {
      setCalendarEvents([...calendarEvents]);
    }, 1000)
  };

  const handleAddManualEvent = () => {
    if (eventName && startDate) {
      const newEvent = {
        id: Date.now(),
        name: eventName,
        startDate,
        endDate: endDate || startDate,
        type: eventType,
      };
      setCalendarEvents([...calendarEvents, newEvent]);
      setEventName("");
      setStartDate("");
      setEndDate("");
      setShowManualForm(false);
    }
  };

  const handleRemoveEvent = (id) => {
    setCalendarEvents(calendarEvents.filter(event => event.id !== id));
  };

  const formatDateRange = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    if (start === end) {
      return startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  return (
    <div className="flex flex-col min-h-[600px] px-12 py-16">
      <div className="flex-1 max-w-4xl mx-auto w-full space-y-10">
        <div className="inline-flex items-center gap-2 text-green-600 mb-4">
          <Calendar size={24} />
          <span className="text-sm uppercase tracking-wider font-medium">Calendar Sync</span>
        </div>

        <div>
          <h1 className="text-4xl mb-3">Sync your academic calendar</h1>
          <p className="text-lg text-gray-600">
            Help UnFold understand your academic schedule to provide better insights on spending patterns during exam weeks, submissions, and events.
          </p>
        </div>

        {/* Manual Entry */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl">Academic events</h2>
            <Button
              onClick={() => setShowManualForm(!showManualForm)}
              variant="outline"
              className="border-2 border-gray-200 hover:bg-gray-50 flex items-center gap-2"
            >
              {showManualForm ? <X size={18} /> : <Plus size={18} />}
              {showManualForm ? 'Cancel' : '  Add'}
            </Button>
          </div>

          {showManualForm && (
            <div className="p-6 bg-gray-50 border-2 border-gray-200 rounded-xl space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium">Event name</label>
                  <Input
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="e.g., Mid-term Exams"
                    className="border-2 border-gray-200 h-12"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start date</label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border-2 border-gray-200 h-12"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">End date (optional)</label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border-2 border-gray-200 h-12"
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium">Event type</label>
                  <div className="grid grid-cols-4 gap-3">
                    {Object.keys(eventTypeConfig).map((type) => (
                      <button
                        key={type}
                        onClick={() => setEventType(type)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          eventType === type
                            ? eventTypeConfig[type].color + ' shadow-sm'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-1">{eventTypeConfig[type].icon}</div>
                          <div className="text-xs font-medium">{eventTypeConfig[type].label}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={handleAddManualEvent}
                className="w-full bg-green-600 text-white hover:bg-green-700 h-12"
                disabled={!eventName || !startDate}
              >
                Add event
              </Button>
            </div>
          )}
        </div>

        {/* Event List */}
        <div className="space-y-3">
          {calendarEvents.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Calendar size={48} className="mx-auto mb-3 opacity-30" />
              <p>No events added yet. Connect Google Calendar or add manually.</p>
            </div>
          ) : (
            calendarEvents
              .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
              .map((event) => (
                <div
                  key={event.id}
                  className={`p-4 border-2 rounded-xl ${eventTypeConfig[event.type].color} hover:shadow-sm transition-shadow`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-2xl">{eventTypeConfig[event.type].icon}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{event.name}</h3>
                        <p className="text-sm text-gray-600">{formatDateRange(event.startDate, event.endDate)}</p>
                        <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-white/50 border border-current">
                          {eventTypeConfig[event.type].label}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveEvent(event.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Info Box */}
        <div className="p-5 bg-green-50 border-l-4 border-green-400 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-2">How this helps your insights</h4>
          <p className="text-sm text-green-800 leading-relaxed">
            By knowing your academic schedule, UnFold can identify spending patterns during stressful periods like exams 
            and help you understand how your academic life impacts your financial behavior. This makes monthly reflections 
            more meaningful and actionable.
          </p>
        </div>

        <div className="pt-6">
          <Button 
            onClick={onContinue}
            className="w-full max-w-md mx-auto block bg-green-600 text-white hover:bg-green-700 h-14 text-lg"
          >
            Continue →
          </Button>
        </div>
      </div>
    </div>
  );
}
