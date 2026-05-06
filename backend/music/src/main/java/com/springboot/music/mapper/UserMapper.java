package com.springboot.music.mapper;

import com.springboot.music.dto.AdminUserDTO;
import com.springboot.music.dto.AdminUserDetailDTO;
import com.springboot.music.dto.UserDTO;
import com.springboot.music.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(source = "role.name", target = "role")
    UserDTO toDto (User user);

    @Mapping(source = "role.name", target = "role")
    AdminUserDTO toAdminDto (User user);

    @Mapping(source = "role.name", target = "role")
    AdminUserDetailDTO toAdminDetailDto(User user);

    List<AdminUserDTO> toDtoList(List<User> users);

}
