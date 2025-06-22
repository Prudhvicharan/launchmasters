-- LaunchMasters Sample Data
-- This file contains sample data for testing the application

-- ============================================================================
-- SAMPLE COLLEGES
-- ============================================================================

-- Insert sample colleges (using College Scorecard API IDs)
INSERT INTO colleges (id, name, city, state, website, admission_rate, tuition_in_state, tuition_out_state, enrollment, sat_avg, act_avg) VALUES
-- Ivy League
('166027', 'Harvard University', 'Cambridge', 'MA', 'https://www.harvard.edu', 0.046, 54768, 54768, 31220, 1520, 34),
('166683', 'Yale University', 'New Haven', 'CT', 'https://www.yale.edu', 0.062, 59950, 59950, 12109, 1515, 34),
('166027', 'Princeton University', 'Princeton', 'NJ', 'https://www.princeton.edu', 0.057, 56010, 56010, 8448, 1505, 34),
('166027', 'Columbia University', 'New York', 'NY', 'https://www.columbia.edu', 0.057, 64530, 64530, 31250, 1505, 34),

-- Top Public Universities
('110635', 'University of California-Berkeley', 'Berkeley', 'CA', 'https://www.berkeley.edu', 0.148, 14254, 44008, 42347, 1415, 32),
('110662', 'University of California-Los Angeles', 'Los Angeles', 'CA', 'https://www.ucla.edu', 0.108, 13204, 43058, 44947, 1405, 31),
('110644', 'University of California-San Diego', 'La Jolla', 'CA', 'https://www.ucsd.edu', 0.342, 14276, 44030, 38634, 1360, 30),
('110653', 'University of California-Davis', 'Davis', 'CA', 'https://www.ucdavis.edu', 0.466, 14402, 44156, 39937, 1280, 28),

-- Top Private Universities
('166027', 'Stanford University', 'Stanford', 'CA', 'https://www.stanford.edu', 0.042, 56169, 56169, 17249, 1440, 33),
('166027', 'Massachusetts Institute of Technology', 'Cambridge', 'MA', 'https://www.mit.edu', 0.065, 55878, 55878, 11520, 1535, 35),
('166027', 'University of Chicago', 'Chicago', 'IL', 'https://www.uchicago.edu', 0.061, 60438, 60438, 17298, 1520, 34),
('166027', 'Northwestern University', 'Evanston', 'IL', 'https://www.northwestern.edu', 0.081, 60484, 60484, 22127, 1495, 33),

-- Liberal Arts Colleges
('166027', 'Williams College', 'Williamstown', 'MA', 'https://www.williams.edu', 0.085, 59950, 59950, 2097, 1470, 33),
('166027', 'Amherst College', 'Amherst', 'MA', 'https://www.amherst.edu', 0.112, 60200, 60200, 1855, 1450, 32),
('166027', 'Swarthmore College', 'Swarthmore', 'PA', 'https://www.swarthmore.edu', 0.089, 56424, 56424, 1597, 1440, 32),
('166027', 'Pomona College', 'Claremont', 'CA', 'https://www.pomona.edu', 0.068, 56478, 56478, 1705, 1450, 32),

-- State Universities
('110635', 'University of Michigan-Ann Arbor', 'Ann Arbor', 'MI', 'https://www.umich.edu', 0.230, 16536, 55204, 48148, 1435, 32),
('110635', 'University of Virginia-Main Campus', 'Charlottesville', 'VA', 'https://www.virginia.edu', 0.209, 19785, 54021, 25822, 1435, 32),
('110635', 'University of North Carolina at Chapel Hill', 'Chapel Hill', 'NC', 'https://www.unc.edu', 0.195, 9002, 36624, 30275, 1385, 30),
('110635', 'University of Wisconsin-Madison', 'Madison', 'WI', 'https://www.wisc.edu', 0.514, 10720, 38608, 44820, 1330, 29),

-- Tech Schools
('166027', 'California Institute of Technology', 'Pasadena', 'CA', 'https://www.caltech.edu', 0.062, 56086, 56086, 2240, 1545, 35),
('166027', 'Carnegie Mellon University', 'Pittsburgh', 'PA', 'https://www.cmu.edu', 0.154, 58024, 58024, 15546, 1465, 33),
('166027', 'Georgia Institute of Technology-Main Campus', 'Atlanta', 'GA', 'https://www.gatech.edu', 0.181, 12736, 33794, 39571, 1435, 32),
('166027', 'University of Illinois Urbana-Champaign', 'Champaign', 'IL', 'https://www.illinois.edu', 0.594, 16862, 34316, 52079, 1330, 29)

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  website = EXCLUDED.website,
  admission_rate = EXCLUDED.admission_rate,
  tuition_in_state = EXCLUDED.tuition_in_state,
  tuition_out_state = EXCLUDED.tuition_out_state,
  enrollment = EXCLUDED.enrollment,
  sat_avg = EXCLUDED.sat_avg,
  act_avg = EXCLUDED.act_avg,
  updated_at = NOW();

-- ============================================================================
-- SAMPLE USER (for testing)
-- ============================================================================

-- Note: This user will be created automatically when you sign up with this email
-- You can use this for testing or create your own user through the app

-- ============================================================================
-- SAMPLE NOTIFICATIONS (for testing)
-- ============================================================================

-- These will be created when you have a user profile
-- You can test notifications by running this after creating a user:

/*
-- Example: Create a test notification (replace 'your-user-id' with actual user ID)
INSERT INTO notifications (user_id, title, message, type, related_id) VALUES
('your-user-id', 'Welcome to LaunchMasters!', 'Start by adding colleges to your list and setting deadlines.', 'system', NULL),
('your-user-id', 'Deadline Reminder', 'Harvard University Early Decision deadline is in 30 days.', 'deadline', '166027'),
('your-user-id', 'Application Update', 'Your Stanford application has been submitted successfully.', 'update', '166027');
*/

-- ============================================================================
-- USEFUL TEST QUERIES
-- ============================================================================

-- View all colleges
-- SELECT * FROM colleges ORDER BY name;

-- Search colleges by name
-- SELECT * FROM colleges WHERE name ILIKE '%harvard%';

-- Search colleges by state
-- SELECT * FROM colleges WHERE state = 'CA' ORDER BY admission_rate;

-- Find colleges with low admission rates (reach schools)
-- SELECT * FROM colleges WHERE admission_rate < 0.1 ORDER BY admission_rate;

-- Find colleges with moderate admission rates (target schools)
-- SELECT * FROM colleges WHERE admission_rate BETWEEN 0.1 AND 0.3 ORDER BY admission_rate;

-- Find colleges with high admission rates (safety schools)
-- SELECT * FROM colleges WHERE admission_rate > 0.5 ORDER BY admission_rate;

-- Find affordable in-state options
-- SELECT * FROM colleges WHERE tuition_in_state < 20000 ORDER BY tuition_in_state;

-- Find colleges with high SAT averages
-- SELECT * FROM colleges WHERE sat_avg > 1400 ORDER BY sat_avg DESC;

-- Dashboard stats (after creating a user)
-- SELECT * FROM get_user_dashboard_stats('your-user-id');

-- ============================================================================
-- NOTES
-- ============================================================================

/*
This sample data includes:
- 20 popular colleges across different categories
- Mix of Ivy League, public universities, liberal arts colleges, and tech schools
- Realistic admission rates, tuition, and test scores
- Geographic diversity across the US

To use this data:
1. Run the schema.sql first
2. Run this sample-data.sql
3. Create a user account through the app
4. Start adding colleges to your list!

The college IDs used here are examples - in production, 
you'll get real IDs from the College Scorecard API.
*/ 