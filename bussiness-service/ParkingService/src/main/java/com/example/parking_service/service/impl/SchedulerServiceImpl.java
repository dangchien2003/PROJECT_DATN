package com.example.parking_service.service.impl;

import com.example.parking_service.dto.other.ScheduledJob;
import com.example.parking_service.dto.other.ScheduledJobId;
import com.example.parking_service.service.SchedulerService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ScheduledFuture;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Transactional
@Slf4j
public class SchedulerServiceImpl implements SchedulerService {
    final TaskScheduler taskScheduler;
    final Map<ScheduledJobId, ScheduledFuture<?>> scheduledTasks = new HashMap<>();

    @Override
    public synchronized void addListTask(List<ScheduledJob> listTask) {
        for (ScheduledJob task : listTask) {
            addTask(task);
        }
    }

    @Override
    public synchronized void removeListTask(List<ScheduledJobId> ids) {
        for (ScheduledJobId id : ids) {
            removeTask(id);
        }
    }

    @Override
    public synchronized void addTask(ScheduledJob task) {
        // xoá task nếu có
        removeTask(task.getScheduledJobId());
        // thêm task
        Instant scheduledTime = task.getRunAt().atZone(ZoneId.systemDefault()).toInstant();
        ScheduledFuture<?> future = taskScheduler.schedule(
                task.getTask(),
                scheduledTime
        );
        // thêm vào quản lý task
        scheduledTasks.put(task.getScheduledJobId(), future);
    }

    @Override
    public synchronized void removeTask(ScheduledJobId id) {
        // xoá key
        ScheduledFuture<?> future = scheduledTasks.remove(id);
        if (future != null) {
            // huỷ tiến trình
            future.cancel(false);
        }
    }

    @Override
    public void refresh() {
        scheduledTasks.keySet().forEach(key -> {
            ScheduledFuture<?> scheduledFuture = scheduledTasks.get(key);
            if (scheduledFuture.isDone() && !scheduledFuture.isCancelled()) {
                removeTask(key);
            } else if (scheduledFuture.isCancelled()) {
                scheduledTasks.remove(key);
            }
        });
    }
}
