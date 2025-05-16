package com.example.parking_service.service;

import com.example.parking_service.dto.other.ScheduledJob;
import com.example.parking_service.dto.other.ScheduledJobId;

import java.util.List;

public interface SchedulerService {

    void addTask(ScheduledJob task);

    void addListTask(List<ScheduledJob> listTask);

    void removeTask(ScheduledJobId job);

    void removeListTask(List<ScheduledJobId> jobs);

    void refresh();
}
