drop database if exists ticketdb;
create database ticketdb;

create table ticketdb.events (
    event_id int primary key,
    available_tickets int
);

create table ticketdb.reservations (
    reversvation_id int primary key,
    event_id int references ticketdb.events(event_id)
);