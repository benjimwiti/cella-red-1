-- Seed data for all tables with at least 3 entries each

-- First, insert some profiles (assuming auth.users exist, using fake UUIDs for demo)
-- Note: In a real scenario, these would correspond to actual auth.users
INSERT INTO public.profiles (id, email, name, role, gender, date_of_birth, region) VALUES
('826fe3d6-bc31-4c94-94d8-974711cd84e0', 'alice@example.com', 'Alice Johnson', 'warrior', 'female', '1990-05-15', 'North America'),
('a050b6ba-b43d-4053-b60c-24b0defcc898', 'bob@example.com', 'Bob Smith', 'caregiver', 'male', '1985-03-22', 'Europe'),
('88cba7f8-6c9a-494b-8bdb-b6bce6b216d3', 'charlie@example.com', 'Charlie Brown', 'warrior', 'male', '1992-11-08', 'Asia'),
('18cd09fc-06c5-43e6-b869-fd6654971ff6', 'diana@example.com', 'Diana Prince', 'caregiver', 'female', '1988-07-30', 'South America')
ON CONFLICT (id) DO NOTHING;

-- Hydration logs
INSERT INTO public.hydration_logs (user_id, date, glasses_consumed, goal_glasses) VALUES
('826fe3d6-bc31-4c94-94d8-974711cd84e0', '2024-10-01', 6, 8),
('826fe3d6-bc31-4c94-94d8-974711cd84e0', '2024-10-02', 8, 8),
('826fe3d6-bc31-4c94-94d8-974711cd84e0', '2024-10-03', 7, 8),
('a050b6ba-b43d-4053-b60c-24b0defcc898', '2024-10-01', 5, 8),
('a050b6ba-b43d-4053-b60c-24b0defcc898', '2024-10-02', 6, 8),
('a050b6ba-b43d-4053-b60c-24b0defcc898', '2024-10-03', 7, 8);

-- Medications
INSERT INTO public.medications (user_id, name, dosage, time_of_day, start_date, end_date, notes, is_active) VALUES
('826fe3d6-bc31-4c94-94d8-974711cd84e0', 'Ibuprofen', '200mg', ARRAY['2024-10-01 08:00:00+00'::timestamptz, '2024-10-01 20:00:00+00'::timestamptz], '2024-09-01', '2024-12-01', 'For pain relief', true),
('826fe3d6-bc31-4c94-94d8-974711cd84e0', 'Aspirin', '100mg', ARRAY['2024-10-01 09:00:00+00'::timestamptz], '2024-09-01', NULL, 'Daily preventive', true),
('826fe3d6-bc31-4c94-94d8-974711cd84e0', 'Paracetamol', '500mg', ARRAY['2024-10-01 12:00:00+00'::timestamptz, '2024-10-01 18:00:00+00'::timestamptz], '2024-09-01', '2024-11-01', 'As needed', true),
('a050b6ba-b43d-4053-b60c-24b0defcc898', 'Vitamin D', '1000IU', ARRAY['2024-10-01 07:00:00+00'::timestamptz], '2024-09-01', NULL, 'Supplement', true),
('a050b6ba-b43d-4053-b60c-24b0defcc898', 'Omega-3', '1000mg', ARRAY['2024-10-01 19:00:00+00'::timestamptz], '2024-09-01', NULL, 'Heart health', true),
('a050b6ba-b43d-4053-b60c-24b0defcc898', 'Calcium', '500mg', ARRAY['2024-10-01 08:00:00+00'::timestamptz], '2024-09-01', NULL, 'Bone health', true);

-- Medication logs (assuming medication IDs from above, using placeholders)
-- Note: In practice, use actual IDs from inserted medications
INSERT INTO public.medication_logs (user_id, medication_id, taken_at, dosage_taken, notes, was_on_time) VALUES
('826fe3d6-bc31-4c94-94d8-974711cd84e0', (SELECT id FROM public.medications WHERE name = 'Ibuprofen' AND user_id = '826fe3d6-bc31-4c94-94d8-974711cd84e0' LIMIT 1), '2024-10-01 08:00:00+00', '200mg', 'Taken as scheduled', true),
('826fe3d6-bc31-4c94-94d8-974711cd84e0', (SELECT id FROM public.medications WHERE name = 'Ibuprofen' AND user_id = '826fe3d6-bc31-4c94-94d8-974711cd84e0' LIMIT 1), '2024-10-01 20:00:00+00', '200mg', 'Slight delay', false),
('826fe3d6-bc31-4c94-94d8-974711cd84e0', (SELECT id FROM public.medications WHERE name = 'Aspirin' AND user_id = '826fe3d6-bc31-4c94-94d8-974711cd84e0' LIMIT 1), '2024-10-01 09:00:00+00', '100mg', 'Morning dose', true),
('a050b6ba-b43d-4053-b60c-24b0defcc898', (SELECT id FROM public.medications WHERE name = 'Vitamin D' AND user_id = 'a050b6ba-b43d-4053-b60c-24b0defcc898' LIMIT 1), '2024-10-01 07:00:00+00', '1000IU', 'Daily supplement', true),
('a050b6ba-b43d-4053-b60c-24b0defcc898', (SELECT id FROM public.medications WHERE name = 'Omega-3' AND user_id = 'a050b6ba-b43d-4053-b60c-24b0defcc898' LIMIT 1), '2024-10-01 19:00:00+00', '1000mg', 'Evening dose', true),
('a050b6ba-b43d-4053-b60c-24b0defcc898', (SELECT id FROM public.medications WHERE name = 'Calcium' AND user_id = 'a050b6ba-b43d-4053-b60c-24b0defcc898' LIMIT 1), '2024-10-01 08:00:00+00', '500mg', 'With breakfast', true);

-- Crisis logs
INSERT INTO public.crisis_logs (user_id, started_at, ended_at, pain_level, triggers, symptoms, treatments_used, location, notes) VALUES
('826fe3d6-bc31-4c94-94d8-974711cd84e0', '2024-10-01 14:00:00+00', '2024-10-01 15:30:00+00', 8, ARRAY['Stress', 'Weather'], ARRAY['Headache', 'Nausea'], ARRAY['Rest', 'Medication'], 'Home', 'Managed with rest'),
('826fe3d6-bc31-4c94-94d8-974711cd84e0', '2024-10-02 10:00:00+00', '2024-10-02 11:00:00+00', 7, ARRAY['Exercise'], ARRAY['Fatigue', 'Pain'], ARRAY['Ice pack'], 'Gym', 'Post-workout'),
('826fe3d6-bc31-4c94-94d8-974711cd84e0', '2024-10-03 16:00:00+00', '2024-10-03 17:00:00+00', 6, ARRAY['Diet'], ARRAY['Dizziness'], ARRAY['Hydration'], 'Office', 'Skipped meal'),
('a050b6ba-b43d-4053-b60c-24b0defcc898', '2024-10-01 12:00:00+00', '2024-10-01 13:00:00+00', 9, ARRAY['Noise'], ARRAY['Migraine'], ARRAY['Dark room'], 'Home', 'Severe episode'),
('a050b6ba-b43d-4053-b60c-24b0defcc898', '2024-10-02 18:00:00+00', '2024-10-02 19:30:00+00', 7, ARRAY['Light'], ARRAY['Eye strain'], ARRAY['Rest'], 'Home', 'Screen time'),
('a050b6ba-b43d-4053-b60c-24b0defcc898', '2024-10-03 09:00:00+00', '2024-10-03 10:00:00+00', 5, ARRAY['Sleep'], ARRAY['Tiredness'], ARRAY['Nap'], 'Home', 'Poor sleep');

-- Meals
INSERT INTO public.meals (user_id, meal_time, meal_type, foods, hydration_ml, notes) VALUES
('826fe3d6-bc31-4c94-94d8-974711cd84e0', '2024-10-01 08:00:00+00', 'breakfast', ARRAY['Oatmeal', 'Banana', 'Coffee'], 250, 'Healthy start'),
('826fe3d6-bc31-4c94-94d8-974711cd84e0', '2024-10-01 12:00:00+00', 'lunch', ARRAY['Salad', 'Chicken', 'Water'], 300, 'Light lunch'),
('826fe3d6-bc31-4c94-94d8-974711cd84e0', '2024-10-01 18:00:00+00', 'dinner', ARRAY['Pasta', 'Vegetables'], 200, 'Family dinner'),
('a050b6ba-b43d-4053-b60c-24b0defcc898', '2024-10-01 07:30:00+00', 'breakfast', ARRAY['Toast', 'Eggs'], 200, 'Quick breakfast'),
('a050b6ba-b43d-4053-b60c-24b0defcc898', '2024-10-01 13:00:00+00', 'lunch', ARRAY['Sandwich', 'Apple'], 250, 'Office lunch'),
('a050b6ba-b43d-4053-b60c-24b0defcc898', '2024-10-01 19:00:00+00', 'dinner', ARRAY['Fish', 'Rice'], 300, 'Evening meal');

-- Appointments
INSERT INTO public.appointments (user_id, title, healthcare_provider, appointment_date, location, notes, is_completed) VALUES
('826fe3d6-bc31-4c94-94d8-974711cd84e0', 'Neurology Checkup', 'Dr. Smith', '2024-10-05 10:00:00+00', 'Clinic A', 'Routine check', false),
('826fe3d6-bc31-4c94-94d8-974711cd84e0', 'Therapy Session', 'Dr. Johnson', '2024-10-10 14:00:00+00', 'Online', 'Weekly session', false),
('826fe3d6-bc31-4c94-94d8-974711cd84e0', 'Blood Test', 'Lab Corp', '2024-10-15 09:00:00+00', 'Lab Center', 'Annual test', true),
('a050b6ba-b43d-4053-b60c-24b0defcc898', 'Dental Cleaning', 'Dr. Lee', '2024-10-07 11:00:00+00', 'Dental Office', 'Six-month check', false),
('a050b6ba-b43d-4053-b60c-24b0defcc898', 'Eye Exam', 'Dr. Patel', '2024-10-12 15:00:00+00', 'Optometrist', 'Vision check', false),
('a050b6ba-b43d-4053-b60c-24b0defcc898', 'Physical Therapy', 'PT Center', '2024-10-20 10:00:00+00', 'Therapy Clinic', 'Weekly session', true);

-- Weather logs
INSERT INTO public.weather_logs (user_id, date, temperature, humidity, pressure, weather_condition, symptom_severity, notes) VALUES
('826fe3d6-bc31-4c94-94d8-974711cd84e0', '2024-10-01', 22.5, 65, 1013.2, 'Sunny', 3, 'Mild symptoms'),
('826fe3d6-bc31-4c94-94d8-974711cd84e0', '2024-10-02', 18.0, 80, 1008.5, 'Rainy', 5, 'Worse with rain'),
('826fe3d6-bc31-4c94-94d8-974711cd84e0', '2024-10-03', 25.0, 50, 1015.0, 'Clear', 2, 'Feeling better'),
('a050b6ba-b43d-4053-b60c-24b0defcc898', '2024-10-01', 20.0, 70, 1010.0, 'Cloudy', 4, 'Headache noted'),
('a050b6ba-b43d-4053-b60c-24b0defcc898', '2024-10-02', 15.5, 85, 1005.5, 'Stormy', 7, 'Severe pain'),
('a050b6ba-b43d-4053-b60c-24b0defcc898', '2024-10-03', 23.0, 60, 1012.0, 'Partly cloudy', 3, 'Improved');

-- Chat logs
INSERT INTO public.chat_logs (user_id, message, response, message_type) VALUES
('826fe3d6-bc31-4c94-94d8-974711cd84e0', 'How can I manage my pain?', 'Try resting and taking medication as prescribed.', 'question'),
('826fe3d6-bc31-4c94-94d8-974711cd84e0', 'I need help now!', 'Please contact emergency services immediately.', 'emergency'),
('826fe3d6-bc31-4c94-94d8-974711cd84e0', 'What''s the weather like?', 'It''s sunny today with mild symptoms reported.', 'general'),
('a050b6ba-b43d-4053-b60c-24b0defcc898', 'Tips for better sleep?', 'Maintain a consistent schedule and avoid screens before bed.', 'question'),
('a050b6ba-b43d-4053-b60c-24b0defcc898', 'Emergency contact?', 'Call 911 or your local emergency number.', 'emergency'),
('a050b6ba-b43d-4053-b60c-24b0defcc898', 'How are you?', 'I''m here to help with your health questions.', 'general');

-- Circles
INSERT INTO public.circles (name, description, emoji, creator_id) VALUES
('Migraine Support Group', 'Support for migraine sufferers', '💫', '88cba7f8-6c9a-494b-8bdb-b6bce6b216d3'),
('Chronic Pain Warriors', 'Community for chronic pain management', '⚔️', '18cd09fc-06c5-43e6-b869-fd6654971ff6'),
('Wellness Circle', 'General wellness and health tips', '🌿', '88cba7f8-6c9a-494b-8bdb-b6bce6b216d3'),
('Caregiver Network', 'For caregivers supporting loved ones', '🤝', '18cd09fc-06c5-43e6-b869-fd6654971ff6');

-- Circle members (creators are auto-added via trigger, adding more)
INSERT INTO public.circle_members (circle_id, user_id, role, status) VALUES
((SELECT id FROM public.circles WHERE name = 'Migraine Support Group' LIMIT 1), '826fe3d6-bc31-4c94-94d8-974711cd84e0', 'member', 'approved'),
((SELECT id FROM public.circles WHERE name = 'Chronic Pain Warriors' LIMIT 1), '826fe3d6-bc31-4c94-94d8-974711cd84e0', 'member', 'approved'),
((SELECT id FROM public.circles WHERE name = 'Wellness Circle' LIMIT 1), 'a050b6ba-b43d-4053-b60c-24b0defcc898', 'member', 'approved'),
((SELECT id FROM public.circles WHERE name = 'Caregiver Network' LIMIT 1), 'a050b6ba-b43d-4053-b60c-24b0defcc898', 'member', 'approved'),
((SELECT id FROM public.circles WHERE name = 'Migraine Support Group' LIMIT 1), 'a050b6ba-b43d-4053-b60c-24b0defcc898', 'member', 'pending'),
((SELECT id FROM public.circles WHERE name = 'Chronic Pain Warriors' LIMIT 1), '88cba7f8-6c9a-494b-8bdb-b6bce6b216d3', 'member', 'approved');

-- Circle invites
INSERT INTO public.circle_invites (circle_id, email, invited_by, status) VALUES
((SELECT id FROM public.circles WHERE name = 'Migraine Support Group' LIMIT 1), 'eve@example.com', '88cba7f8-6c9a-494b-8bdb-b6bce6b216d3', 'sent'),
((SELECT id FROM public.circles WHERE name = 'Chronic Pain Warriors' LIMIT 1), 'frank@example.com', '18cd09fc-06c5-43e6-b869-fd6654971ff6', 'accepted'),
((SELECT id FROM public.circles WHERE name = 'Wellness Circle' LIMIT 1), 'grace@example.com', '88cba7f8-6c9a-494b-8bdb-b6bce6b216d3', 'expired'),
((SELECT id FROM public.circles WHERE name = 'Caregiver Network' LIMIT 1), 'henry@example.com', '18cd09fc-06c5-43e6-b869-fd6654971ff6', 'sent'),
((SELECT id FROM public.circles WHERE name = 'Migraine Support Group' LIMIT 1), 'ivy@example.com', '88cba7f8-6c9a-494b-8bdb-b6bce6b216d3', 'sent'),
((SELECT id FROM public.circles WHERE name = 'Chronic Pain Warriors' LIMIT 1), 'jack@example.com', '18cd09fc-06c5-43e6-b869-fd6654971ff6', 'accepted');

-- Mood logs
INSERT INTO public.mood_logs (user_id, date, mood_level, notes) VALUES
('826fe3d6-bc31-4c94-94d8-974711cd84e0', '2024-10-01', 6, 'Feeling okay today'),
('826fe3d6-bc31-4c94-94d8-974711cd84e0', '2024-10-02', 4, 'A bit down'),
('826fe3d6-bc31-4c94-94d8-974711cd84e0', '2024-10-03', 7, 'Good day'),
('a050b6ba-b43d-4053-b60c-24b0defcc898', '2024-10-01', 5, 'Neutral'),
('a050b6ba-b43d-4053-b60c-24b0defcc898', '2024-10-02', 3, 'Struggling'),
('a050b6ba-b43d-4053-b60c-24b0defcc898', '2024-10-03', 8, 'Positive');

-- Medication preferences
INSERT INTO public.medication_preferences (user_id, notify_daily_summary, notify_before, notify_after) VALUES
('826fe3d6-bc31-4c94-94d8-974711cd84e0', true, true, false),
('826fe3d6-bc31-4c94-94d8-974711cd84e0', false, true, true),
('826fe3d6-bc31-4c94-94d8-974711cd84e0', true, false, true);
