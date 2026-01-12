import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';

const Container = styled.div`
  padding: 20px;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1));
  border-radius: 12px;
  margin: 20px 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const MonthNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const NavButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const MonthTitle = styled.h2`
  color: white;
  margin: 0;
  font-size: 24px;
  display: flex;
  gap: 10px;
`;

const DropdownButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 24px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const Dropdown = styled.select`
  background: #1F2937;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 24px;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
`;

const DayHeader = styled.div`
  background: rgba(139, 92, 246, 0.3);
  color: white;
  padding: 12px;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
`;

const DayCell = styled.div<{ $isToday?: boolean; $isOtherMonth?: boolean; $hasHoliday?: boolean; $hasAdminEvent?: boolean }>`
  background: ${props => 
    props.$hasAdminEvent ? 'rgba(239, 68, 68, 0.3)' :
    props.$hasHoliday ? 'rgba(34, 197, 94, 0.3)' :
    props.$isOtherMonth ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)'
  };
  min-height: 120px;
  padding: 6px;
  cursor: pointer;
  border: ${props => props.$isToday ? '2px solid #EC4899' : 'none'};
  
  &:hover {
    background: rgba(139, 92, 246, 0.2);
  }
`;

const DayNumber = styled.div<{ $isOtherMonth?: boolean }>`
  color: ${props => props.$isOtherMonth ? 'rgba(255, 255, 255, 0.4)' : 'white'};
  font-weight: 600;
  margin-bottom: 4px;
`;

const Event = styled.div<{ $type: string }>`
  background: ${props => 
    props.$type === 'national_holiday' ? '#EF4444' :
    props.$type === 'custom_holiday' ? '#F59E0B' :
    props.$type === 'academic_event' ? '#3B82F6' :
    '#10B981'
  };
  color: white;
  padding: 1px 4px;
  border-radius: 3px;
  font-size: 9px;
  margin-bottom: 1px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.2;
  cursor: pointer;
  position: relative;
  
  &:hover {
    opacity: 0.8;
  }
  
  &:hover::after {
    content: '×';
    position: absolute;
    right: 2px;
    top: 0;
    font-size: 10px;
    font-weight: bold;
  }
`;

const Modal = styled.div<{ $show: boolean }>`
  display: ${props => props.$show ? 'flex' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #1F2937;
  padding: 24px;
  border-radius: 12px;
  width: 400px;
  max-width: 90vw;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  color: white;
  margin-bottom: 8px;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  
  option {
    background: #1F2937;
    color: white;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  resize: vertical;
  min-height: 60px;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  background: ${props => props.$variant === 'primary' ? 
    'linear-gradient(135deg, #8B5CF6, #EC4899)' : 
    'rgba(255, 255, 255, 0.1)'
  };
  color: white;
  
  &:hover {
    opacity: 0.9;
  }
`;

export default function Calendar() {
  const { state } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [nationalHolidaysLoaded, setNationalHolidaysLoaded] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'academic_event'
  });

  const currentUser = state.currentUser;

  useEffect(() => {
    const loadCalendar = async () => {
      if (!nationalHolidaysLoaded) {
        await initializeHolidays();
        setNationalHolidaysLoaded(true);
      }
      await fetchEvents();
    };
    loadCalendar();
  }, [currentUser, currentDate, nationalHolidaysLoaded]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/calendar', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched events:', data); // Debug log
        setEvents(data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const initializeHolidays = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/calendar/init-holidays', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('Holiday initialization response:', response.status);
      if (response.ok) {
        const result = await response.json();
        console.log('Holidays initialized:', result);
      }
    } catch (error) {
      console.error('Error initializing holidays:', error);
    }
  };

  const handleDateClick = (date: Date) => {
    if (currentUser?.role === 'admin') {
      setSelectedDate(date);
      setSelectedEvent(null);
      setIsEditing(false);
      setFormData({ title: '', description: '', type: 'academic_event' });
      setShowModal(true);
    }
  };

  const handleEventClick = (event: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentUser?.role === 'admin' && event.type !== 'national_holiday') {
      setSelectedEvent(event);
      setIsEditing(true);
      setFormData({
        title: event.title,
        description: event.description || '',
        type: event.type
      });
      setShowModal(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && selectedEvent) {
        // Update existing event
        const response = await fetch(`http://localhost:5001/api/calendar/${selectedEvent._id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        
        if (response.ok) {
          setShowModal(false);
          setIsEditing(false);
          setSelectedEvent(null);
          setFormData({ title: '', description: '', type: 'academic_event' });
          fetchEvents();
        }
      } else {
        // Create new event
        if (!selectedDate) return;
        
        const response = await fetch('http://localhost:5001/api/calendar', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...formData,
            date: selectedDate.toISOString()
          })
        });

        if (response.ok) {
          setShowModal(false);
          setFormData({ title: '', description: '', type: 'academic_event' });
          fetchEvents();
        }
      }
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleDeleteEvent = async (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentUser?.role !== 'admin') return;
    
    try {
      const response = await fetch(`http://localhost:5001/api/calendar/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        fetchEvents();
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getEventsForDate = (date: Date) => {
    const dateEvents = events.filter((event: any) => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
    console.log(`Events for ${date.toDateString()}:`, dateEvents); // Debug log
    return dateEvents;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleMonthChange = (month: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(month);
    setCurrentDate(newDate);
    setShowMonthDropdown(false);
  };

  const handleYearChange = (year: number) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    setCurrentDate(newDate);
    setShowYearDropdown(false);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Container>
      <Header>
        <MonthNavigation>
          <NavButton onClick={() => navigateMonth(-1)}>‹</NavButton>
          <MonthTitle>
            {showMonthDropdown ? (
              <Dropdown 
                value={currentDate.getMonth()}
                onChange={(e) => handleMonthChange(parseInt(e.target.value))}
                onBlur={() => setShowMonthDropdown(false)}
                autoFocus
              >
                {monthNames.map((month, index) => (
                  <option key={index} value={index}>{month}</option>
                ))}
              </Dropdown>
            ) : (
              <DropdownButton onClick={() => setShowMonthDropdown(true)}>
                {monthNames[currentDate.getMonth()]}
              </DropdownButton>
            )}
            {showYearDropdown ? (
              <Dropdown 
                value={currentDate.getFullYear()}
                onChange={(e) => handleYearChange(parseInt(e.target.value))}
                onBlur={() => setShowYearDropdown(false)}
                autoFocus
              >
                {Array.from({length: 10}, (_, i) => 2020 + i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </Dropdown>
            ) : (
              <DropdownButton onClick={() => setShowYearDropdown(true)}>
                {currentDate.getFullYear()}
              </DropdownButton>
            )}
          </MonthTitle>
          <NavButton onClick={() => navigateMonth(1)}>›</NavButton>
        </MonthNavigation>
      </Header>

      <CalendarGrid>
        {dayNames.map(day => (
          <DayHeader key={day}>{day}</DayHeader>
        ))}
        
        {getDaysInMonth(currentDate).map((date, index) => {
          const dayEvents = getEventsForDate(date);
          const hasHoliday = dayEvents.some((event: any) => event.type === 'national_holiday' || event.type === 'custom_holiday');
          const hasAdminEvent = dayEvents.some((event: any) => event.type === 'academic_event' || event.type === 'special_event');
          return (
            <DayCell
              key={index}
              $isToday={isToday(date)}
              $isOtherMonth={!isCurrentMonth(date)}
              $hasHoliday={hasHoliday}
              $hasAdminEvent={hasAdminEvent}
              onClick={() => handleDateClick(date)}
            >
              <DayNumber $isOtherMonth={!isCurrentMonth(date)}>
                {date.getDate()}
              </DayNumber>
              {dayEvents.map((event: any) => (
                <Event 
                  key={event._id} 
                  $type={event.type}
                  onClick={(e) => handleEventClick(event, e)}
                >
                  {event.title}
                </Event>
              ))}
            </DayCell>
          );
        })}
      </CalendarGrid>

      <Modal $show={showModal}>
        <ModalContent>
          <h3 style={{ color: 'white', marginTop: 0 }}>
            {isEditing ? 'Edit Event' : 'Add Event'}
          </h3>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Event Title</Label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter event title"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Event Type</Label>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="academic_event">Academic Event</option>
                <option value="custom_holiday">Holiday</option>
                <option value="special_event">Special Event</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Description (Optional)</Label>
              <TextArea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter event description"
              />
            </FormGroup>

            <ButtonGroup>
              <Button type="button" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              {isEditing && (
                <Button 
                  type="button" 
                  onClick={() => {
                    if (selectedEvent) {
                      handleDeleteEvent(selectedEvent._id, { stopPropagation: () => {} } as React.MouseEvent);
                      setShowModal(false);
                      setIsEditing(false);
                      setSelectedEvent(null);
                      setFormData({ title: '', description: '', type: 'academic_event' });
                    }
                  }}
                  style={{ background: '#EF4444' }}
                >
                  Delete
                </Button>
              )}
              <Button type="submit" $variant="primary">
                {isEditing ? 'Update Event' : 'Add Event'}
              </Button>
            </ButtonGroup>
          </form>
        </ModalContent>
      </Modal>
    </Container>
  );
}