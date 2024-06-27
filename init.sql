drop database if exists ticketdb;
create database ticketdb;

create table ticketdb.events (
    event_id int primary key AUTO_INCREMENT,
    available_tickets int
);

insert into ticketdb.events (available_tickets) values (100);

create table ticketdb.reservations (
    reservations_id int primary key AUTO_INCREMENT,
    user_id int,
    event_id int references ticketdb.events(event_id)
);