---
trigger: always_on
---

# The Data Librarian Architecture

## 1. Tech Stack
- Interface html/css/js
- Python CLI

## 2. Project Standards

- Event Bus Programming Pattern, abides the following rules:
-- Broadcasted events MUST have ONLY a single broadcaster. It SHOULD be the event's source of truth
-- Listeners MUST subscribe to a broadcaster's event to respond to it.
-- Broadcasters and Listeners WILL NOT execute code outside of their own scope. EXCEPT for the actual event bus implementation

- Moduler Python CLI's, abides by the following rules:
-- Logging is a MUST and every module MUST be designed with this 
-- Logging MUST be as close to real time as possible and is a HARD requirement for all modules.
-- All output content MUST be identical no matter the format. (eg. server terminal, file logs, and html logs MUST all be identical in their content)
-- ALL modules MUST have a verified and working output format to be considered code complete.


## 4. Data Notification
- Systems/Data changes must be notified via the Event Bus.
- Do not couple Systems to UI Controllers.